"use client";
import React , {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

function VideoUpload() {
    const [file,setFile] =useState<File | null>(null)
    const [title,settitle]=useState("")
    const [description,setdescription]=useState("")
    const [isuploading,setisuploading]=useState(false)
    const router = useRouter()
    //max file size of 670 mb
    const MAX_FILE_SIZE= 70 * 1024 * 1024;
    const handlesubmit = async(event : React.FormEvent)=>{
      event.preventDefault()
      if(!file) return ;
      if(file.size>MAX_FILE_SIZE){
        //add a notifcation
        alert("file is too large");
        return;
      }
      setisuploading(true)
      const formdata = new FormData();
      formdata.append("file",file);
      formdata.append("title",title)
      formdata.append("description",description);;
      formdata.append("originalsize",file.size.toString());
      try {
        const response = await axios.post("/api/video-upload",formdata)
      } catch (error) {
        console.log(error);
      }
      finally{
        setisuploading(false)
      }
    }
  return (
    <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
          <form onSubmit={handlesubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Video File</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input file-input-bordered w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isuploading}
            >
              {isuploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      );
}

export default VideoUpload