package com.hcl.hotelbooking.service;

import com.hcl.hotelbooking.entity.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    void deleteUser(Long id);
    User updateUserRole(Long id, String role);
}
