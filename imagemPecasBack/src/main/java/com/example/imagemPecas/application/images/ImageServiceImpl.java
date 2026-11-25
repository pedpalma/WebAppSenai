package com.example.imagemPecas.application.images;

import com.example.imagemPecas.domain.entity.Image;
import com.example.imagemPecas.domain.enums.ImageExtension;
import com.example.imagemPecas.domain.exception.BusinessRuleException;
import com.example.imagemPecas.domain.service.ImageService;
import com.example.imagemPecas.infra.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private static final long MAX_FILE_SIZE = 4L * 1024 * 1024; // RN03: 4 MB
    private static final int MAX_TEXT_LENGTH = 50;              // RN05

    private final ImageRepository repository;

    @Override
    @Transactional
    public Image save(Image image) {
        validate(image);
        return repository.save(image);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Image> getById(String id) {
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Image> search(ImageExtension extension, String query) {
        return repository.findByExtensionAndNameOrTagsLike(extension,query);
    }

    private void validate(Image image) {
        // RN05: nome e tags obrigatórios, com no máximo 50 caracteres cada
        if (!StringUtils.hasText(image.getName())) {
            throw new BusinessRuleException("Name is required!");
        }
        if (image.getName().length() > MAX_TEXT_LENGTH) {
            throw new BusinessRuleException("Name must have at most 50 characters!");
        }
        if (!StringUtils.hasText(image.getTags())) {
            throw new BusinessRuleException("Tags are required!");
        }
        if (image.getTags().length() > MAX_TEXT_LENGTH) {
            throw new BusinessRuleException("Tags must have at most 50 characters!");
        }
        // RN04: somente PNG, JPEG e GIF
        if (image.getExtension() == null) {
            throw new BusinessRuleException("Invalid format! Accepted formats: PNG, JPEG, GIF.");
        }
        // RN03: no máximo 4 MB
        if (image.getFile() == null || image.getSize() == null || image.getSize() == 0) {
            throw new BusinessRuleException("File is required!");
        }
        if (image.getSize() > MAX_FILE_SIZE) {
            throw new BusinessRuleException("File is too large! Max size: 4 MB.");
        }
    }
}
