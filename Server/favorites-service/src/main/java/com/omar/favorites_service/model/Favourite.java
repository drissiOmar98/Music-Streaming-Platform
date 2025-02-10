package com.omar.favorites_service.model;



import com.omar.favorites_service.model.id.FavouriteId;
import com.omar.favorites_service.shared.AbstractAuditingEntity;
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
@Table(name = "favorite_song")
@IdClass(FavouriteId.class)
public class Favourite extends AbstractAuditingEntity<FavouriteId> {

    @Id
    private String userId;

    @Id
    private Long songId;

    @Override
    public FavouriteId getId() {
        return new FavouriteId(userId, songId);
    }


}
