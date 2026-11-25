package com.example.imagemPecas;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Testes de ponta a ponta da API cobrindo os casos de uso CSU01, CSU02, CSU04, CSU05 e CSU06. */
@SpringBootTest
@AutoConfigureMockMvc
class ImagemPecasApiTests {

    // PNG 1x1 válido
    private static final byte[] PNG_BYTES = {
            (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, (byte) 0xC4,
            (byte) 0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41, 0x54, 0x78, (byte) 0x9C, 0x63, 0x00, 0x01, 0x00,
            0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, (byte) 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
            (byte) 0xAE, 0x42, 0x60, (byte) 0x82
    };

    @Autowired
    private MockMvc mvc;

    private String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@teste.com";
    }

    private void signUp(String email, String password) throws Exception {
        mvc.perform(post("/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Fulano","email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isCreated());
    }

    private String login(String email, String password) throws Exception {
        var result = mvc.perform(post("/v1/users/auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, password)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", not(emptyString())))
                .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.accessToken");
    }

    private String newUserToken() throws Exception {
        var email = uniqueEmail();
        signUp(email, "12345678");
        return login(email, "12345678");
    }

    private MockMultipartHttpServletRequestBuilder upload(MockMultipartFile file, String name, String tags) {
        var builder = multipart("/v1/images").file(file);
        builder.param("name", name);
        builder.param("tags", tags);
        return builder;
    }

    @Test
    void contextLoads() {
    }

    // CSU01 + RN01
    @Test
    void naoPermiteCadastrarEmailDuplicado() throws Exception {
        var email = uniqueEmail();
        signUp(email, "12345678");

        mvc.perform(post("/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Outro","email":"%s","password":"abcdefgh"}
                                """.formatted(email)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("User already exists!"));
    }

    // RN02
    @Test
    void naoPermiteSenhaCurta() throws Exception {
        mvc.perform(post("/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Fulano","email":"%s","password":"123"}
                                """.formatted(uniqueEmail())))
                .andExpect(status().isBadRequest());
    }

    // CSU02 - exceção E1
    @Test
    void autenticacaoComSenhaErradaRetorna401() throws Exception {
        var email = uniqueEmail();
        signUp(email, "12345678");

        mvc.perform(post("/v1/users/auth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","password":"senhaerrada"}
                                """.formatted(email)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("User or password are incorrect!"));
    }

    // RNF02 / CSU04 - exceção E2
    @Test
    void publicarSemTokenRetorna401() throws Exception {
        var file = new MockMultipartFile("file", "a.png", "image/png", PNG_BYTES);
        mvc.perform(upload(file, "Placa", "hardware"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenInvalidoRetorna401() throws Exception {
        var file = new MockMultipartFile("file", "a.png", "image/png", PNG_BYTES);
        mvc.perform(upload(file, "Placa", "hardware").header("Authorization", "Bearer abc.def.ghi"))
                .andExpect(status().isUnauthorized());
    }

    // CSU04 + CSU05 + CSU06 - fluxo completo
    @Test
    void publicaPesquisaEVisualizaImagem() throws Exception {
        var token = newUserToken();
        var nome = "Placa Mae " + UUID.randomUUID().toString().substring(0, 8);
        var file = new MockMultipartFile("file", "placa.png", "image/png", PNG_BYTES);

        var created = mvc.perform(upload(file, nome, "placa mae,hardware")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/v1/images/")))
                .andReturn();
        var location = created.getResponse().getHeader("Location");

        // pesquisa por nome + extensão
        mvc.perform(get("/v1/images").param("query", nome.toLowerCase()).param("extension", "png"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value(nome))
                .andExpect(jsonPath("$[0].extension").value("PNG"))
                .andExpect(jsonPath("$[0].size").value(PNG_BYTES.length))
                .andExpect(jsonPath("$[0].uploadDate", matchesPattern("\\d{2}/\\d{2}/\\d{4}")))
                .andExpect(jsonPath("$[0].tags", contains("placa mae", "hardware")))
                .andExpect(jsonPath("$[0].url").value(location));

        // filtro de extensão que não corresponde
        mvc.perform(get("/v1/images").param("query", nome).param("extension", "GIF"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // visualização pública da imagem em tamanho real
        var id = location.substring(location.lastIndexOf('/') + 1);
        mvc.perform(get("/v1/images/" + id))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG))
                .andExpect(header().string("Content-Disposition", containsString("inline")))
                .andExpect(header().string("Content-Disposition", containsString(".png")))
                .andExpect(content().bytes(PNG_BYTES));
    }

    @Test
    void imagemInexistenteRetorna404() throws Exception {
        mvc.perform(get("/v1/images/nao-existe"))
                .andExpect(status().isNotFound());
    }

    // RN04
    @Test
    void rejeitaFormatoInvalido() throws Exception {
        var token = newUserToken();
        var file = new MockMultipartFile("file", "doc.pdf", "application/pdf", new byte[]{1, 2, 3});
        mvc.perform(upload(file, "Documento", "pdf").header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    // RN03
    @Test
    void rejeitaArquivoMaiorQue4MB() throws Exception {
        var token = newUserToken();
        var file = new MockMultipartFile("file", "big.png", "image/png", new byte[4 * 1024 * 1024 + 1]);
        mvc.perform(upload(file, "Grande", "big").header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    // RN05
    @Test
    void rejeitaNomeMaiorQue50Caracteres() throws Exception {
        var token = newUserToken();
        var file = new MockMultipartFile("file", "a.png", "image/png", PNG_BYTES);
        mvc.perform(upload(file, "x".repeat(51), "tag").header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }
}
