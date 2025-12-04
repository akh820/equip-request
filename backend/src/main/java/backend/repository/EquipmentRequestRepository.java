package backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import backend.domain.EquipmentRequest;
import backend.domain.EquipmentRequest.RequestStatus;

public interface EquipmentRequestRepository extends JpaRepository<EquipmentRequest, Long> {

    // Before(N+1)
    List<EquipmentRequest> findByUserId(Long userId);
    // After(N+1)
    @Query("SELECT DISTINCT r FROM EquipmentRequest r " +
           "JOIN FETCH r.items i " +
           "JOIN FETCH i.equipment " +
           "JOIN FETCH r.user " +
           "WHERE r.user.id = :userId")
    List<EquipmentRequest> findByUserIdWithItems(@Param("userId") Long userId);

    @Query("SELECT DISTINCT r FROM EquipmentRequest r " +
           "JOIN FETCH r.items i " +
           "JOIN FETCH i.equipment " +
           "JOIN FETCH r.user")
    List<EquipmentRequest> findAllWithItems();

    @Query("SELECT DISTINCT r FROM EquipmentRequest r " +
           "JOIN FETCH r.items i " +
           "JOIN FETCH i.equipment " +
           "WHERE r.id = :id")
    Optional<EquipmentRequest> findByIdWithItems(@Param("id") Long id);

    List<EquipmentRequest> findByStatus(RequestStatus status);

    List<EquipmentRequest> findByStatusOrderByCreatedAtAsc(RequestStatus status);
}
