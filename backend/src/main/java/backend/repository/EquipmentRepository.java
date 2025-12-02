package backend.repository;

import backend.domain.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    // 카테고리로 비품 조회
    List<Equipment> findByCategory(String category);

    // 신청 가능한 비품만 조회
    // SELECT * FROM equipment WHERE available = TRUE;
    List<Equipment> findByAvailableTrue();

    // 비품명으로 검색 = LIKE
    List<Equipment> findByNameContaining(String keyword);
}
