package com.jobboard.controller;

import com.jobboard.dto.NotificationResponse;
import com.jobboard.dto.PageResponse;
import com.jobboard.entity.User;
import com.jobboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final DashboardService dashboardService;

    @GetMapping
    public PageResponse<NotificationResponse> getNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return dashboardService.getNotifications(user, page, size);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @AuthenticationPrincipal User user) {
        dashboardService.markNotificationRead(id, user);
        return ResponseEntity.noContent().build();
    }
}
