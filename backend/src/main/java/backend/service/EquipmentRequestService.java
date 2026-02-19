package backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import backend.domain.Equipment;
import backend.domain.EquipmentRequest;
import backend.domain.RequestItem;
import backend.domain.User;
import backend.repository.EquipmentRepository;
import backend.repository.EquipmentRequestRepository;
import backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EquipmentRequestService {

    private final EquipmentRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;

    @Transactional
    public Long createRequest(Long userId, List<RequestItemDto> items) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        EquipmentRequest request = EquipmentRequest.builder()
                .user(user)
                .status(EquipmentRequest.RequestStatus.PENDING)
                .build();

        for (RequestItemDto itemDto : items) {
            Equipment equipment = equipmentRepository.findById(itemDto.getEquipmentId())
                    .orElseThrow(() -> new IllegalArgumentException("비품을 찾을 수 없습니다."));

            RequestItem item = RequestItem.builder()
                    .equipment(equipment)
                    .quantity(itemDto.getQuantity())
                    .build();

            request.addItem(item);
        }

        EquipmentRequest saved = requestRepository.save(request);
        return saved.getId();
    }

    public List<EquipmentRequest> findMyRequests(Long userId) {
        return requestRepository.findByUserIdWithItems(userId);
    }

    public List<EquipmentRequest> findAll() {
        return requestRepository.findAllWithItems();
    }

    public List<EquipmentRequest> findByStatus(EquipmentRequest.RequestStatus status) {
        return requestRepository.findByStatus(status);
    }

    @Transactional
    public void approve(Long requestId) {
        // N+1 최적화: Fetch Join 사용 (items와 equipment를 함께 조회)
        EquipmentRequest request = requestRepository.findByIdWithItems(requestId)
                .orElseThrow(() -> new IllegalArgumentException("신청을 찾을 수 없습니다."));

        request.approve();

        for (RequestItem item : request.getItems()) {
            item.getEquipment().decreaseStock(item.getQuantity());
        }
    }

    @Transactional
    public void reject(Long requestId, String reason) {
        EquipmentRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("신청을 찾을 수 없습니다."));

        request.reject(reason);
    }

    public ReturnValidationResult validateReturnToken(String token) {
        EquipmentRequest request = requestRepository.findByReturnTokenWithItems(token)
                .orElse(null);

        if (request == null) {
            return new ReturnValidationResult("NOT_FOUND", null);
        }

        if (request.getStatus() == EquipmentRequest.RequestStatus.RETURNED) {
            return new ReturnValidationResult("ALREADY_RETURNED", request);
        }

        // 30일 유효기간 체크
        if (request.getProcessedAt() != null &&
                request.getProcessedAt().plusDays(30).isBefore(LocalDateTime.now())) {
            return new ReturnValidationResult("EXPIRED", request);
        }

        return new ReturnValidationResult("VALID", request);
    }

    @Transactional
    public void processReturn(String token) {
        EquipmentRequest request = requestRepository.findByReturnTokenWithItems(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 반납 토큰입니다."));

        if (request.getStatus() == EquipmentRequest.RequestStatus.RETURNED) {
            throw new IllegalStateException("이미 반납 처리된 신청입니다.");
        }

        if (request.getProcessedAt() != null &&
                request.getProcessedAt().plusDays(30).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("반납 유효기간이 만료되었습니다.");
        }

        request.markAsReturned();
    }

    @Getter
    @AllArgsConstructor
    public static class ReturnValidationResult {
        private String tokenStatus;
        private EquipmentRequest request;
    }

    @Getter
    @AllArgsConstructor
    // 단순 독립 사용용
    public static class RequestItemDto {
        private Long equipmentId;
        private Integer quantity;
    }
}
