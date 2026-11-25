package com.example.imagemPecas.application.images;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class ImageDTO {
    private String url;
    private String name;
    private String extension;
    private Long size;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate uploadDate;
    private List<String> tags;
}
