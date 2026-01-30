---
description: Create a Spring Boot REST API controller and service
---

# /spring-api [ResourceName]

<!-- Spring Boot REST API 컨트롤러 및 서비스 생성 -->

## Usage
```
/spring-api Challenge
/spring-api User --crud
/spring-api Transaction --readonly
```

## Steps

// turbo
1. Create Controller `src/main/java/com/woorido/controller/[Resource]Controller.java`:

```java
package com.woorido.controller;

import com.woorido.dto.[Resource]Dto;
import com.woorido.dto.request.Create[Resource]Request;
import com.woorido.dto.response.ApiResponse;
import com.woorido.service.[Resource]Service;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/[resources]")
@RequiredArgsConstructor
public class [Resource]Controller {

    private final [Resource]Service [resource]Service;

    @GetMapping
    public ApiResponse<List<[Resource]Dto>> getAll() {
        return ApiResponse.success([resource]Service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<[Resource]Dto> getById(@PathVariable String id) {
        return ApiResponse.success([resource]Service.findById(id));
    }

    @PostMapping
    public ApiResponse<[Resource]Dto> create(
        @Valid @RequestBody Create[Resource]Request request
    ) {
        return ApiResponse.success([resource]Service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<[Resource]Dto> update(
        @PathVariable String id,
        @Valid @RequestBody Update[Resource]Request request
    ) {
        return ApiResponse.success([resource]Service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        [resource]Service.delete(id);
        return ApiResponse.success(null);
    }
}
```

// turbo
2. Create Service `src/main/java/com/woorido/service/[Resource]Service.java`:

```java
package com.woorido.service;

import com.woorido.dto.[Resource]Dto;
import com.woorido.dto.request.Create[Resource]Request;
import com.woorido.entity.[Resource];
import com.woorido.exception.NotFoundException;
import com.woorido.mapper.[Resource]Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class [Resource]Service {

    private final [Resource]Mapper [resource]Mapper;

    public List<[Resource]Dto> findAll() {
        return [resource]Mapper.selectAll().stream()
            .map([Resource]Dto::from)
            .toList();
    }

    public [Resource]Dto findById(String id) {
        [Resource] entity = [resource]Mapper.selectById(id);
        if (entity == null) {
            throw new NotFoundException("[Resource] not found: " + id);
        }
        return [Resource]Dto.from(entity);
    }

    @Transactional
    public [Resource]Dto create(Create[Resource]Request request) {
        [Resource] entity = [Resource].builder()
            .id(UUID.randomUUID().toString())
            .title(request.getTitle())
            // ... other fields
            .build();
        
        [resource]Mapper.insert(entity);
        return [Resource]Dto.from(entity);
    }

    @Transactional
    public void delete(String id) {
        [resource]Mapper.softDeleteById(id);
    }
}
```

// turbo
3. Create DTO `src/main/java/com/woorido/dto/[Resource]Dto.java`:

```java
package com.woorido.dto;

import com.woorido.entity.[Resource];
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class [Resource]Dto {
    private String id;
    private String title;
    private LocalDateTime createdAt;
    
    public static [Resource]Dto from([Resource] entity) {
        return [Resource]Dto.builder()
            .id(entity.getId())
            .title(entity.getTitle())
            .createdAt(entity.getCreatedAt())
            .build();
    }
}
```

## ApiResponse Pattern

```java
// dto/response/ApiResponse.java
@Getter
public class ApiResponse<T> {
    private final boolean success;
    private final T data;
    private final String message;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
```

---

## Java 17 Record DTO Pattern (권장)

<!-- Java 17 Record를 활용한 불변 DTO 패턴 -->

```java
// dto/response/[Resource]Response.java
public record [Resource]Response(
    String id,
    String title,
    BigDecimal amount,
    String status,
    LocalDateTime createdAt
) {
    public static [Resource]Response from([Resource] entity) {
        return new [Resource]Response(
            entity.getId(),
            entity.getTitle(),
            entity.getAmount(),
            entity.getStatus(),
            entity.getCreatedAt()
        );
    }
}

// dto/request/Create[Resource]Request.java
public record Create[Resource]Request(
    @NotBlank String title,
    @NotNull @Positive BigDecimal amount,
    String description
) {}
```

**장점**: 코드 간결, 불변성 보장, Jackson 호환, `equals/hashCode` 자동 생성

---

## Strategy Pattern (수수료/정책 계산)

<!-- 런타임 알고리즘 선택 패턴 - 수수료 계산, 투표 승인 등 -->

```java
// strategy/FeeStrategy.java
public interface FeeStrategy {
    BigDecimal calculate(BigDecimal amount);
    String getType();
}

// strategy/impl/RegularFeeStrategy.java
@Component("REGULAR")
public class RegularFeeStrategy implements FeeStrategy {
    private static final BigDecimal RATE = new BigDecimal("0.01"); // 1%
    
    @Override
    public BigDecimal calculate(BigDecimal amount) {
        return amount.multiply(RATE).setScale(0, RoundingMode.DOWN);
    }
    
    @Override
    public String getType() { return "REGULAR"; }
}

// strategy/impl/PremiumFeeStrategy.java
@Component("PREMIUM")
public class PremiumFeeStrategy implements FeeStrategy {
    private static final BigDecimal RATE = new BigDecimal("0.03"); // 3%
    
    @Override
    public BigDecimal calculate(BigDecimal amount) {
        return amount.multiply(RATE).setScale(0, RoundingMode.DOWN);
    }
    
    @Override
    public String getType() { return "PREMIUM"; }
}

// service/FeeService.java
@Service
@RequiredArgsConstructor
public class FeeService {
    private final Map<String, FeeStrategy> strategies;
    
    public BigDecimal calculateFee(String type, BigDecimal amount) {
        FeeStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new BusinessException("Unknown fee type: " + type);
        }
        return strategy.calculate(amount);
    }
}
```

**적용 범위**: 수수료 계산 (1%/3%/1.5%), 투표 승인 (과반수/2/3), 알림 발송

---

## Visitor Pattern (결제 시스템)

<!-- 객체 구조 변경 없이 새 연산 추가 - 결제, 정산, 리포트 -->

```java
// payment/PaymentMethod.java
public interface PaymentMethod {
    void accept(PaymentVisitor visitor);
}

// payment/TossPayment.java
@Getter
public class TossPayment implements PaymentMethod {
    private String orderId;
    private BigDecimal amount;
    
    @Override
    public void accept(PaymentVisitor visitor) {
        visitor.visit(this);
    }
}

// payment/KakaoPayment.java
@Getter  
public class KakaoPayment implements PaymentMethod {
    private String tid;
    private BigDecimal amount;
    
    @Override
    public void accept(PaymentVisitor visitor) {
        visitor.visit(this);
    }
}

// payment/PaymentVisitor.java
public interface PaymentVisitor {
    void visit(TossPayment payment);
    void visit(KakaoPayment payment);
}

// payment/PaymentProcessor.java
@Component
public class PaymentProcessor implements PaymentVisitor {
    
    @Override
    public void visit(TossPayment payment) {
        // Toss API 호출 로직
        log.info("Processing Toss payment: {}", payment.getOrderId());
    }
    
    @Override
    public void visit(KakaoPayment payment) {
        // Kakao API 호출 로직
        log.info("Processing Kakao payment: {}", payment.getTid());
    }
}
```

**적용 범위**: 결제 (Toss/카카오페이/계좌이체), 정산 시스템, 리포트 생성

---

## Factory Pattern (Provider 생성)

<!-- 객체 생성 로직 캡슐화 - 결제 Provider, 알림 채널 -->

```java
// factory/PaymentProviderFactory.java
@Component
@RequiredArgsConstructor
public class PaymentProviderFactory {
    private final TossPaymentProvider tossProvider;
    private final KakaoPaymentProvider kakaoProvider;
    
    public PaymentProvider create(PaymentType type) {
        return switch (type) {
            case TOSS -> tossProvider;
            case KAKAO -> kakaoProvider;
            case BANK_TRANSFER -> new BankTransferProvider();
            default -> throw new BusinessException("Unsupported payment type");
        };
    }
}

// factory/NotificationFactory.java
@Component
public class NotificationFactory {
    
    public NotificationSender create(NotificationType type) {
        return switch (type) {
            case PUSH -> new PushNotificationSender();
            case SMS -> new SmsNotificationSender();
            case EMAIL -> new EmailNotificationSender();
        };
    }
}
```

**적용 범위**: 결제 Provider 생성, 알림 채널 생성, 분석 전략 생성

---

## Soft Delete Pattern (삭제 정책)

<!-- 물리 삭제 대신 deleted_at 컬럼 업데이트 -->

```java
// entity/BaseEntity.java
@MappedSuperclass
@Getter
public abstract class BaseEntity {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt; // Soft Delete
    
    public boolean isDeleted() {
        return deletedAt != null;
    }
}

// service/[Resource]Service.java
@Transactional
public void softDelete(String id) {
    [Resource] entity = [resource]Mapper.selectById(id);
    if (entity == null || entity.isDeleted()) {
        throw new NotFoundException("[Resource] not found: " + id);
    }
    [resource]Mapper.softDeleteById(id);
}
```

```xml
<!-- Mapper XML -->
<update id="softDeleteById">
    UPDATE [RESOURCES]
    SET DELETED_AT = SYSDATE, UPDATED_AT = SYSDATE
    WHERE [RESOURCE]_ID = #{id} AND DELETED_AT IS NULL
</update>

<select id="selectAll" resultMap="[resource]ResultMap">
    SELECT * FROM [RESOURCES]
    WHERE DELETED_AT IS NULL
    ORDER BY CREATED_AT DESC
</select>
```

---

## Lock Patterns (동시성 제어)

### 낙관적 락 (Optimistic Lock - Profile/Settings)

```java
// entity/[Resource].java
@Getter
@Setter
public class [Resource] {
    private String id;
    private Long version; // 낙관적 락용 버전
    // ...
}
```

```xml
<update id="updateWithVersion">
    UPDATE [RESOURCES]
    SET TITLE = #{title}, VERSION = VERSION + 1, UPDATED_AT = SYSDATE
    WHERE [RESOURCE]_ID = #{id} AND VERSION = #{version}
</update>
```

```java
// Service에서 버전 체크
int updated = [resource]Mapper.updateWithVersion(entity);
if (updated == 0) {
    throw new OptimisticLockException("Data was modified by another user");
}
```

### 비관적 락 (Pessimistic Lock - Money/Inventory)

```xml
<!-- SELECT FOR UPDATE -->
<select id="selectByIdForUpdate" resultMap="[resource]ResultMap">
    SELECT * FROM [RESOURCES]
    WHERE [RESOURCE]_ID = #{id}
    FOR UPDATE
</select>
```

```java
// Service에서 비관적 락 사용
@Transactional
public void updateBalance(String id, BigDecimal amount) {
    // 락 획득
    Account account = accountMapper.selectByIdForUpdate(id);
    
    // 잔액 검증 및 업데이트
    if (account.getBalance().compareTo(amount) < 0) {
        throw new InsufficientBalanceException();
    }
    account.setBalance(account.getBalance().subtract(amount));
    accountMapper.update(account);
}
```

**사용 기준**:
| 락 타입 | 사용 대상 | 충돌 빈도 |
|---------|----------|----------|
| 낙관적 (Version) | Profile, Settings | 낮음 |
| 비관적 (SFU) | Balance, Inventory | 높음 |
