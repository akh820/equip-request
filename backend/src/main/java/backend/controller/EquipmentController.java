package backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import backend.domain.Equipment;
import backend.service.EquipmentService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<List<EquipmentResponse>> findAll() {
        List<Equipment> equipmentList = equipmentService.findAll();
        List<EquipmentResponse> response = equipmentList.stream()
                .map(item -> EquipmentResponse.from(item))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponse> findById(@PathVariable Long id) {
        Equipment equipment = equipmentService.findById(id);
        return ResponseEntity.ok(EquipmentResponse.from(equipment));
    }

    @GetMapping("/search")
    public ResponseEntity<List<EquipmentResponse>> search(@RequestParam String keyword) {
        List<Equipment> equipmentList = equipmentService.search(keyword);
        List<EquipmentResponse> response = equipmentList.stream()
                .map(EquipmentResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // TODO : 추후 파일 <-> DTO 따로 분리하여 결합도 낮추기
    @PostMapping
    public ResponseEntity<CreateEquipmentResponse> create(
            @ModelAttribute CreateEquipmentRequest request
    ) {
        Long equipmentId = equipmentService.create(
                request.getName(),
                request.getDescription(),
                request.getCategory(),
                request.getImage(),
                request.getStock(),
                request.getAvailable()
        );
        return ResponseEntity.ok(new CreateEquipmentResponse(equipmentId, "비품 등록 성공"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> update(
            @PathVariable Long id,
            @ModelAttribute UpdateEquipmentRequest request
    ) {
        equipmentService.update(
                id,
                request.getName(),
                request.getDescription(),
                request.getCategory(),
                request.getImage(),
                request.getStock(),
                request.getAvailable()
        );
        return ResponseEntity.ok(new MessageResponse("비품 수정 성공"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        equipmentService.delete(id);
        return ResponseEntity.ok(new MessageResponse("비품 삭제 성공"));
    }

    @Getter
    @AllArgsConstructor
    public static class EquipmentResponse {
        private Long id;
        private String name;
        private String description;
        private String category;
        private String imageUrl;
        private Integer stock;
        private Boolean available;
        private String createdAt;

        public static EquipmentResponse from(Equipment equipment) {
            return new EquipmentResponse(
                    equipment.getId(),
                    equipment.getName(),
                    equipment.getDescription(),
                    equipment.getCategory(),
                    equipment.getImageUrl(),
                    equipment.getStock(),
                    equipment.getAvailable(),
                    equipment.getCreatedAt().toString()
            );
        }
    }

    @Getter
    @Setter
    public static class CreateEquipmentRequest {
        private String name;
        private String description;
        private String category;
        private MultipartFile image;
        private Integer stock;
        private Boolean available;
    }

    @Getter
    @AllArgsConstructor
    public static class CreateEquipmentResponse {
        private Long equipmentId;
        private String message;
    }

    @Getter
    @Setter
    public static class UpdateEquipmentRequest {
        private String name;
        private String description;
        private String category;
        private MultipartFile image;
        private Integer stock;
        private Boolean available;
    }

    @Getter
    @AllArgsConstructor
    // 객체 형태로 반환하기 위해 MessageResponse 사용
    public static class MessageResponse {
        private String message;
    }
}
