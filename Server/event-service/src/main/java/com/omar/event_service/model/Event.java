package com.omar.event_service.model;


import jakarta.persistence.*;
import lombok.*;



import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "eventSequenceGenerator")
    @SequenceGenerator(name = "eventSequenceGenerator", sequenceName = "event_seq", allocationSize = 1)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "location")
    private String location;

    @Column(name = "start_date_time", nullable = false)
    private Date startDateTime;

    @Column(name = "end_date_time", nullable = false)
    private Date endDateTime;

    @OneToMany(mappedBy = "event", cascade = CascadeType.REMOVE)
    private Set<EventPicture> pictures = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "event_artists", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "artist_id")
    private Set<Long> artistIds = new HashSet<>();


}
