import { Avatar, Card, CardActionArea, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import type { Artist } from "@/types";
import { resolveImageUrl } from "@/utils/constants";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();

  return (
    <Card elevation={0} sx={{ borderRadius: 2 }}>
      <CardActionArea
        onClick={() => navigate(`/artists/${artist.artistId}`)}
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Avatar
          src={resolveImageUrl(artist.imageUrl)}
          alt={artist.artistName}
          sx={{ width: "100%", height: 140, borderRadius: "50%" }}
        >
          <PersonIcon sx={{ fontSize: 48 }} />
        </Avatar>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          noWrap
          sx={{ width: "100%" }}
        >
          {artist.artistName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Artist
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default ArtistCard;
