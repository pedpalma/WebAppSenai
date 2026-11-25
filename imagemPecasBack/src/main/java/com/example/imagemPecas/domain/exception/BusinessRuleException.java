package com.example.imagemPecas.domain.exception;

/** Lançada quando os dados recebidos violam alguma regra de negócio (RN02 a RN05). */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}
