package com.omar.event_participation_service.model;


import com.omar.event_participation_service.model.id.ParticipationId;
import com.omar.event_participation_service.shared.AbstractAuditingEntity;
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
@Table(name = "event_attendees")
@IdClass(ParticipationId.class)
public class EventParticipation extends AbstractAuditingEntity<ParticipationId> {

    @Id
    private String userId;

    @Id
    private Long eventId;

    @Override
    public ParticipationId getId() {
        return new ParticipationId(userId, eventId);
    }

}
