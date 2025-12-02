package backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "request_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RequestItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private EquipmentRequest equipmentRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(nullable = false)
    private Integer quantity;

    // EquipmentRequest 양방향 연관관계 편의 메서드
    public void setEquipmentRequest(EquipmentRequest equipmentRequest) {
        this.equipmentRequest = equipmentRequest;
    }
}
