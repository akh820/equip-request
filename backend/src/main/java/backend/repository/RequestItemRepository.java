package backend.repository;

import backend.domain.RequestItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestItemRepository extends JpaRepository<RequestItem, Long> {

    List<RequestItem> findByEquipmentRequestId(Long requestId);

    List<RequestItem> findByEquipmentId(Long equipmentId);
}
