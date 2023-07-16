import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>();
  const { supabaseClient } = useSessionContext();

  const fetchSong = async () => {
    const { data, error } = await supabaseClient
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      setIsLoading(false);
      return toast.error(error.message);
    }

    setSong(data as Song);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!id) {
      return
    };

    fetchSong();
  }, [id, supabaseClient])

  return useMemo(() => ({
    isLoading,
    song
  }), [isLoading, song])
}
