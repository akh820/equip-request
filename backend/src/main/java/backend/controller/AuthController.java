package backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.domain.User;
import backend.service.UserService;
import backend.util.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

        // BCrypt 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).build();
        }

        // JWT 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                accessToken,
                refreshToken
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
