package backend.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
public abstract class BaseEntity { // BaseEntity는 보통 단독으로 쓰일일이 없기때문에 추상 클래스로 설정

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
