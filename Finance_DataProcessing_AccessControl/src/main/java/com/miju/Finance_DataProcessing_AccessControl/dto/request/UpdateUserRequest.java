package com.miju.Finance_DataProcessing_AccessControl.dto.request;

import com.miju.Finance_DataProcessing_AccessControl.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    /** Null means leave the role unchanged. */
    private Role role;
}
