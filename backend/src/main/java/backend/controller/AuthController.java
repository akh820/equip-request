package backend.controller;

import backend.domain.User;
import backend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest request) {
        Long userId = userService.signup(
                request.getEmail(),
                request.getPassword(),
                request.getName()
        );
        // TODO: 에러 전역 처리 

        return ResponseEntity.ok(new SignupResponse(userId, "회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail());

        // TODO: BCrypt 비밀번호 검증
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).build();
        }

        // TODO: JWT 토큰 발급
        return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                "mock-access-token",
                "mock-refresh-token"
        ));
    }

    @Getter
    @AllArgsConstructor
    public static class SignupRequest {
        private String email;
        private String password;
        private String name;
    }

    @Getter
    @AllArgsConstructor
    public static class SignupResponse {
        private Long userId;
        private String message;
    }

    @Getter
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Getter
    @AllArgsConstructor
    public static class LoginResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String accessToken;
        private String refreshToken;
    }
}
