package com.omar.event_service.model;

import com.omar.event_service.shared.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.*;

import java.util.Arrays;
import java.util.Objects;

@Entity
@Table(name = "event_pictures")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventPicture  extends AbstractAuditingEntity<Long> {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "eventPictureSequenceGenerator")
    @SequenceGenerator(name = "eventPictureSequenceGenerator", sequenceName = "event_picture_seq", allocationSize = 50)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private Event event;

    @Lob
    @Column(name = "file", nullable = false)
    private byte[] file;

    @Column(name = "file_content_type", nullable = false)
    private String fileContentType;

    @Column(name = "is_cover", nullable = false)
    private boolean isCover;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EventPicture that = (EventPicture) o;
        return isCover == that.isCover && Objects.deepEquals(file, that.file) && Objects.equals(fileContentType, that.fileContentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(Arrays.hashCode(file), fileContentType, isCover);
    }

    @Override
    public String toString() {
        return "EventPicture{" +
                "file=" + Arrays.toString(file) +
                ", fileContentType='" + fileContentType + '\'' +
                ", isCover=" + isCover +
                '}';
    }





}
