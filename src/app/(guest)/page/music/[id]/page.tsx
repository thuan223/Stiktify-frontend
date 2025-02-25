import { handleDisPlayMusicAction } from "@/actions/music.action";
import CommentSection from "@/components/music/comment/comment.section";
import DisplayMusicDetail from "@/components/music/detail.music";

const MusicDetail = async ({ params }: any) => {
  const { id } = params;
  const res = await handleDisPlayMusicAction(id);
  const data = res?.data;

  if (res?.error) {
    return <div>Not found id</div>;
  }
  return (
    <div>
      <div className="h-[40vh]">
        <DisplayMusicDetail item={data} />
      </div>
      <div className="h-[46vh]">
        <CommentSection musicId={id} />
      </div>
    </div>
  );
};

export default MusicDetail;
