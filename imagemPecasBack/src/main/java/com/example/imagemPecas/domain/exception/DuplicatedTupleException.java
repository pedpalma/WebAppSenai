package com.example.imagemPecas.domain.exception;

/** Lançada quando se tenta gravar um registro que já existe (ex.: e-mail já cadastrado - RN01). */
public class DuplicatedTupleException extends RuntimeException {
    public DuplicatedTupleException(String message) {
        super(message);
    }
}
