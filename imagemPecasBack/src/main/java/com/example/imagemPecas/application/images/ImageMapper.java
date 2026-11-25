package com.example.imagemPecas.application.images;

import com.example.imagemPecas.domain.entity.Image;
import com.example.imagemPecas.domain.enums.ImageExtension;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ImageMapper {
    public Image mapToImage(MultipartFile file, String name, List<String> tags) throws IOException {
        return Image.builder()
                .name(name == null ? null : name.trim())
                .tags(joinTags(tags))
                .size(file.getSize())
                .extension(toExtension(file.getContentType()))
                .file(file.getBytes())
                .build();
    }

    public ImageDTO imageToDTO(Image image, String url){
        return ImageDTO.builder()
                .url(url)
                .extension(image.getExtension().name())
                .name(image.getName())
                .size(image.getSize())
                .uploadDate(image.getUploadDate() == null ? null : image.getUploadDate().toLocalDate())
                .tags(splitTags(image.getTags()))
                .build();
    }

    private ImageExtension toExtension(String contentType) {
        if (!StringUtils.hasText(contentType)) {
            return null;
        }
        try {
            return ImageExtension.valueOf(MediaType.valueOf(contentType));
        } catch (InvalidMediaTypeException e) {
            return null;
        }
    }

    private String joinTags(List<String> tags) {
        if (tags == null) {
            return "";
        }
        return tags.stream()
                .map(String::trim)
                .filter(StringUtils::hasText)
                .collect(Collectors.joining(","));
    }

    private List<String> splitTags(String tags) {
        if (!StringUtils.hasText(tags)) {
            return List.of();
        }
        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }
}
