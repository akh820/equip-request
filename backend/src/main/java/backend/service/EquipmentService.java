package backend.service;

import backend.domain.Equipment;
import backend.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final S3Service s3Service;

    public List<Equipment> findAll() {
        return equipmentRepository.findAll();
    }

    public Equipment findById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("비품을 찾을 수 없습니다."));
    }

    public List<Equipment> findByCategory(String category) {
        return equipmentRepository.findByCategory(category);
    }

    public List<Equipment> findAvailable() {
        return equipmentRepository.findByAvailableTrue();
    }

    public List<Equipment> search(String keyword) {
        return equipmentRepository.findByNameContaining(keyword);
    }

    @Transactional
    public Long create(String name, String description, String category,
                       MultipartFile imageFile, Integer stock, Boolean available) {
        // 이미지 파일이 있으면 S3에 업로드
        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                imageUrl = s3Service.uploadFile(imageFile);
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
            }
        }

        Equipment equipment = Equipment.builder()
                .name(name)
                .description(description)
                .category(category)
                .imageUrl(imageUrl)
                .stock(stock)
                .available(available)
                .build();

        Equipment saved = equipmentRepository.save(equipment);
        return saved.getId();
    }

    @Transactional
    public void decreaseStock(Long equipmentId, int quantity) {
        Equipment equipment = findById(equipmentId);
        equipment.decreaseStock(quantity);
    }

    @Transactional
    public void increaseStock(Long equipmentId, int quantity) {
        Equipment equipment = findById(equipmentId);
        equipment.increaseStock(quantity);
    }

    @Transactional
    public void update(Long id, String name, String description, String category,
                       MultipartFile imageFile, Integer stock, Boolean available) {
        Equipment equipment = findById(id);

        // 이미지 파일이 있으면 기존 이미지 삭제 후 새 이미지 업로드
        String imageUrl = equipment.getImageUrl(); // 기존 URL 유지
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                // 기존 이미지가 있으면 삭제
                if (equipment.getImageUrl() != null && !equipment.getImageUrl().isEmpty()) {
                    try {
                        s3Service.deleteFile(equipment.getImageUrl());
                    } catch (Exception e) {
                        // 삭제 실패해도 계속 진행 (로그만 출력)
                        System.err.println("기존 이미지 삭제 실패: " + e.getMessage());
                    }
                }
                // 새 이미지 업로드
                imageUrl = s3Service.uploadFile(imageFile);
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
            }
        }

        equipment.update(name, description, category, imageUrl, stock, available);
    }

    @Transactional
    public void delete(Long id) {
        Equipment equipment = findById(id);
        equipmentRepository.delete(equipment);
    }
}
