package backend.domain;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(name = "return_token")
    private String returnToken;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    //fetch = FetchType.EAGET => LAZY
    @OneToMany(mappedBy = "equipmentRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RequestItem> items = new ArrayList<>();

    public enum RequestStatus {
        PENDING, APPROVED, REJECTED, RETURNED
    }

    public void approve() {
        this.status = RequestStatus.APPROVED;
        this.processedAt = LocalDateTime.now();
        String datePrefix = this.processedAt.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        this.returnToken = datePrefix + "_" + random;
    }

    public void reject(String reason) {
        this.status = RequestStatus.REJECTED;
        this.rejectReason = reason;
        this.processedAt = LocalDateTime.now();
    }

    public void markAsReturned() {
        this.status = RequestStatus.RETURNED;
        this.returnedAt = LocalDateTime.now();
    }

    // RequestItem 양방향 연관관계 편의 메서드
    public void addItem(RequestItem item) {
        this.items.add(item);
        // 객체 주소와 연결하기 위함
        item.setEquipmentRequest(this);
    }
}
