package com.omar.event_service.dto.response;

import com.omar.event_service.client.artist.DisplayCardArtistDTO;
import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.common.PictureDTO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
public class DisplayEventDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Date startDateTime;
    private Date endDateTime;
    private List<PictureDTO> pictures;
    private Set<DisplayCardArtistDTO> artists;
}
