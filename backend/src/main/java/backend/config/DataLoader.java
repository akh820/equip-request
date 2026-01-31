package backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import backend.domain.Equipment;
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
        Equipment macbook = Equipment.builder()
                .name("MacBook Pro 14")
                .description("Apple M3 Pro, 18GB RAM。開発職の標準機器。")
                .category("laptop")
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000")
                .stock(5)
                .available(true)
                .build();
        equipmentRepository.save(macbook);

        Equipment monitor = Equipment.builder()
                .name("LG 27インチ 4Kモニター")
                .description("27UK850-W。高解像度業務用モニター。")
                .category("monitor")
                .imageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000")
                .stock(12)
                .available(true)
                .build();
        equipmentRepository.save(monitor);

        Equipment mouse = Equipment.builder()
                .name("ロジテック MX Master 3")
                .description("ワイヤレスマウス。人間工学デザイン。")
                .category("peripherals")
                .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000")
                .stock(0)
                .available(true)
                .build();
        equipmentRepository.save(mouse);

        Equipment paper = Equipment.builder()
                .name("A4用紙（箱）")
                .description("Double A 80g、2500枚。")
                .category("office_supplies")
                .imageUrl("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=1000")
                .stock(50)
                .available(true)
                .build();
        equipmentRepository.save(paper);

        Equipment keyboard = Equipment.builder()
                .name("メカニカルキーボード")
                .description("赤軸メカニカルキーボード。")
                .category("furniture")
                .imageUrl("https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000")
                .stock(8)
                .available(true)
                .build();
        equipmentRepository.save(keyboard);

        Equipment chair = Equipment.builder()
                .name("ハーマンミラー チェア")
                .description("チームリーダー以上に支給。")
                .category("others")
                .imageUrl("https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000")
                .stock(2)
                .available(false)
                .build();
        equipmentRepository.save(chair);
    }
}
