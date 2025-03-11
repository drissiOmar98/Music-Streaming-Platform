package com.omar.follow_service.model;




import com.omar.follow_service.model.id.FollowId;
import com.omar.follow_service.shared.AbstractAuditingEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "follow_artist")
@IdClass(FollowId.class)
public class Follow extends AbstractAuditingEntity<FollowId> {

    @Id
    private String userId;

    @Id
    private Long artistId;

    @Override
    public FollowId getId() {
        return new FollowId(userId, artistId);
    }


}
