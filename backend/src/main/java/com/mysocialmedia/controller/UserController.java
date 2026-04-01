package com.mysocialmedia.controller;

import com.mysocialmedia.dto.UserDTO;
import com.mysocialmedia.dto.UserUpdateDTO;
import com.mysocialmedia.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable String id,
                                               @RequestBody UserUpdateDTO dto,
                                               Authentication auth) {
        String currentUserId = (String) auth.getPrincipal();
        return ResponseEntity.ok(userService.updateUser(id, currentUserId, dto));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<UserDTO> followUser(@PathVariable String id, Authentication auth) {
        String currentUserId = (String) auth.getPrincipal();
        return ResponseEntity.ok(userService.followUser(id, currentUserId));
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<UserDTO> unfollowUser(@PathVariable String id, Authentication auth) {
        String currentUserId = (String) auth.getPrincipal();
        return ResponseEntity.ok(userService.unfollowUser(id, currentUserId));
    }
}
