package backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.domain.EquipmentRequest;
import backend.service.EquipmentRequestService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class EquipmentRequestController {

    private final EquipmentRequestService requestService;

    @PostMapping
    public ResponseEntity<CreateRequestResponse> create(
            Authentication authentication,
            @RequestBody CreateRequestRequest request) {
        // JWT에서 userId 추출
        Long userId = Long.parseLong(authentication.getName());

        List<EquipmentRequestService.RequestItemDto> items = request.getItems().stream()
                .map(item -> new EquipmentRequestService.RequestItemDto(
                        item.getEquipmentId(),
                        item.getQuantity()
                ))
                .collect(Collectors.toList());

        Long requestId = requestService.createRequest(userId, items);
        return ResponseEntity.ok(new CreateRequestResponse(requestId, "신청 완료"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RequestResponse>> findMyRequests(Authentication authentication) {
        // JWT에서 userId 추출
        Long userId = Long.parseLong(authentication.getName());

        List<EquipmentRequest> requests = requestService.findMyRequests(userId);
        List<RequestResponse> response = requests.stream()
                .map(RequestResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<RequestResponse>> findAll() {
        List<EquipmentRequest> requests = requestService.findAll();
        List<RequestResponse> response = requests.stream()
                .map(RequestResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin/{id}/approve")
    public ResponseEntity<String> approve(@PathVariable Long id) {
        requestService.approve(id);
        return ResponseEntity.ok("승인 완료");
    }

    @PostMapping("/admin/{id}/reject")
    public ResponseEntity<String> reject(@PathVariable Long id, @RequestBody RejectRequest request) {
        requestService.reject(id, request.getReason());
        return ResponseEntity.ok("반려 완료");
    }

    @Getter
    @AllArgsConstructor
    public static class CreateRequestRequest {
        private Long userId;
        private List<RequestItemRequest> items;
    }

    @Getter
    @AllArgsConstructor
    public static class RequestItemRequest {
        private Long equipmentId;
        private Integer quantity;
    }

    @Getter
    @AllArgsConstructor
    public static class CreateRequestResponse {
        private Long requestId;
        private String message;
    }

    @Getter
    @AllArgsConstructor
    public static class RequestResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String status;
        private List<RequestItemResponse> items;
        private String createdAt;
        private String processedAt;
        private String rejectReason;

        public static RequestResponse from(EquipmentRequest request) {
            List<RequestItemResponse> items = request.getItems().stream()
                    .map(item -> new RequestItemResponse(
                            item.getId(),
                            item.getEquipment().getId(),
                            item.getEquipment().getName(),
                            item.getQuantity()
                    ))
                    .collect(Collectors.toList());

            return new RequestResponse(
                    request.getId(),
                    request.getUser().getId(),
                    request.getUser().getName(),
                    request.getStatus().name(),
                    items,
                    request.getCreatedAt().toString(),
                    request.getProcessedAt() != null ? request.getProcessedAt().toString() : null,
                    request.getRejectReason()
            );
        }
    }

    @Getter
    @AllArgsConstructor
    public static class RequestItemResponse {
        private Long id;
        private Long equipmentId;
        private String equipmentName;
        private Integer quantity;
    }

    @Getter
    @AllArgsConstructor
    public static class RejectRequest {
        private String reason;
    }
}
