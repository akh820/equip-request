package backend.service;

import backend.domain.Equipment;
import backend.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

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
                       String imageUrl, Integer stock, Boolean available) {
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
}
