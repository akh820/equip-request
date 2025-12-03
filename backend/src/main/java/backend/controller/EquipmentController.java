package backend.controller;

import backend.domain.Equipment;
import backend.service.EquipmentService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @PostMapping
    public ResponseEntity<CreateEquipmentResponse> create(@RequestBody CreateEquipmentRequest request) {
        Long equipmentId = equipmentService.create(
                request.getName(),
                request.getDescription(),
                request.getCategory(),
                request.getImageUrl(),
                request.getStock(),
                request.getAvailable()
        );
        return ResponseEntity.ok(new CreateEquipmentResponse(equipmentId, "비품 등록 성공"));
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
    @AllArgsConstructor
    public static class CreateEquipmentRequest {
        private String name;
        private String description;
        private String category;
        private String imageUrl;
        private Integer stock;
        private Boolean available;
    }

    @Getter
    @AllArgsConstructor
    public static class CreateEquipmentResponse {
        private Long equipmentId;
        private String message;
    }
}
