package backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipment_requests")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EquipmentRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(name = "reject_reason")
    private String rejectReason;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @OneToMany(mappedBy = "equipmentRequest", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<RequestItem> items = new ArrayList<>();

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED
    }

    public void approve() {
        this.status = RequestStatus.APPROVED;
        this.processedAt = LocalDateTime.now();
    }

    public void reject(String reason) {
        this.status = RequestStatus.REJECTED;
        this.rejectReason = reason;
        this.processedAt = LocalDateTime.now();
    }

    // RequestItem 양방향 연관관계 편의 메서드
    public void addItem(RequestItem item) {
        this.items.add(item);
        // 객체 주소와 연결하기 위함
        item.setEquipmentRequest(this);
    }
}
