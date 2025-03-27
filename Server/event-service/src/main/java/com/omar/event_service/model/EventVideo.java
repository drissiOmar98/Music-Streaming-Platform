package com.omar.event_service.model;


import com.omar.event_service.shared.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_videos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventVideo extends AbstractAuditingEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "eventVideoSequenceGenerator")
    @SequenceGenerator(name = "eventVideoSequenceGenerator", sequenceName = "event_video_seq", allocationSize = 50)
    private Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private Event event;

    @Lob
    @Column(name = "file")
    private byte[] file;

    @Column(name = "file_content_type")
    private String fileContentType;

    @Column(name = "video_url")
    private String videoUrl;
}
