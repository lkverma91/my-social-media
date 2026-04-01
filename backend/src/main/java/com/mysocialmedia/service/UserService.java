package com.mysocialmedia.service;

import com.mysocialmedia.dto.UserDTO;
import com.mysocialmedia.dto.UserUpdateDTO;
import com.mysocialmedia.model.User;
import com.mysocialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    public UserDTO updateUser(String id, String currentUserId, UserUpdateDTO dto) {
        if (!id.equals(currentUserId)) {
            throw new RuntimeException("You can only update your own profile");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }
        userRepository.save(user);
        return toDTO(user);
    }

    public UserDTO followUser(String targetId, String currentUserId) {
        if (targetId.equals(currentUserId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (!currentUser.getFollowing().contains(targetId)) {
            currentUser.getFollowing().add(targetId);
            targetUser.getFollowers().add(currentUserId);
            userRepository.save(currentUser);
            userRepository.save(targetUser);
        }

        return toDTO(currentUser);
    }

    public UserDTO unfollowUser(String targetId, String currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        currentUser.getFollowing().remove(targetId);
        targetUser.getFollowers().remove(currentUserId);
        userRepository.save(currentUser);
        userRepository.save(targetUser);

        return toDTO(currentUser);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setFollowers(user.getFollowers());
        dto.setFollowing(user.getFollowing());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
