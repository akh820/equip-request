package backend.repository;

import backend.domain.EquipmentRequest;
import backend.domain.EquipmentRequest.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRequestRepository extends JpaRepository<EquipmentRequest, Long> {

    List<EquipmentRequest> findByUserId(Long userId);

    List<EquipmentRequest> findByStatus(RequestStatus status);

    List<EquipmentRequest> findByStatusOrderByCreatedAtAsc(RequestStatus status);
}
