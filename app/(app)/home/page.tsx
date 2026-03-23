"use client";
import React , {useState,useCallback,useEffect} from 'react'
import axios from 'axios';
import Videocard from '@/Components/Videocard';
import { Video } from '@/types';
function Home() {
  const [videos,setvideos]=useState<Video[]>([])
  const [loading,setloading]=useState(true)
  const [error,seterror]=useState<string | null >(null)
  const fetchvideos = useCallback(async()=>{
    try {
      const response=await axios.get("/api/videos")
      if(Array.isArray(response.data)){
        setvideos(response.data)
      } else{
        throw new Error("unexpected error")
      }
    } catch (error) {
      console.log(error);
      seterror("failed to fetch videos");
    } finally{
      setloading(false)
    }
  },[])
  useEffect(()=>{
    fetchvideos()
  },[fetchvideos])
    const handleDownload = useCallback((url: string, title: string) => {
        () => {
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${title}.mp4`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [])
    if(loading){
      return <div>Loading...</div>
    }
  return (
<div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Videos</h1>
          {videos.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              No videos available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                videos.map((video) => (
                  <Videocard
                  key={
                    video.publicId}
                    video={video}
                    onDownload={handleDownload}
                    />
                ))
              }
            </div>
          )}
        </div>
      );
}

export default Home;