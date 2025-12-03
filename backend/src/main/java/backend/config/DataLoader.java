package backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import backend.domain.Equipment;
import backend.domain.User;
import backend.repository.EquipmentRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EquipmentRepository equipmentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        User user = User.builder()
                .email("user@test.com")
                .password("1234")
                .name("일반사원 김철수")
                .role(User.UserRole.USER)
                .build();
        userRepository.save(user);

        User admin = User.builder()
                .email("admin@test.com")
                .password("1234")
                .name("관리자 이영희")
                .role(User.UserRole.ADMIN)
                .build();
        userRepository.save(admin);

        Equipment macbook = Equipment.builder()
                .name("MacBook Pro 14")
                .description("Apple M3 Pro, 18GB RAM. 개발직군 표준 장비.")
                .category("노트북")
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000")
                .stock(5)
                .available(true)
                .build();
        equipmentRepository.save(macbook);

        Equipment monitor = Equipment.builder()
                .name("LG 27인치 4K 모니터")
                .description("27UK850-W. 고해상도 업무용 모니터.")
                .category("모니터")
                .imageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000")
                .stock(12)
                .available(true)
                .build();
        equipmentRepository.save(monitor);

        Equipment mouse = Equipment.builder()
                .name("로지텍 MX Master 3")
                .description("무선 마우스. 인체공학 디자인.")
                .category("주변기기")
                .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000")
                .stock(0)
                .available(true)
                .build();
        equipmentRepository.save(mouse);

        Equipment paper = Equipment.builder()
                .name("A4 용지 (박스)")
                .description("Double A 80g, 2500매.")
                .category("사무용품")
                .imageUrl("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=1000")
                .stock(50)
                .available(true)
                .build();
        equipmentRepository.save(paper);

        Equipment keyboard = Equipment.builder()
                .name("기계식 키보드")
                .description("적축 기계식 키보드.")
                .category("주변기기")
                .imageUrl("https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000")
                .stock(8)
                .available(true)
                .build();
        equipmentRepository.save(keyboard);

        Equipment chair = Equipment.builder()
                .name("허먼밀러 의자")
                .description("팀장급 이상 지급.")
                .category("가구")
                .imageUrl("https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000")
                .stock(2)
                .available(false)
                .build();
        equipmentRepository.save(chair);

        System.out.println(" 일반 사용자: user@test.com / 1234");
        System.out.println(" 관리자: admin@test.com / 1234");
    }
}
