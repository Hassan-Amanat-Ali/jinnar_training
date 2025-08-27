import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import VideoPlayer from '../components/video/VideoPlayer';
import Playlist from '../components/video/Playlist';

// Demo data (replace with real lecture data later)
const demoLectures = [
  {
    id: '1',
    title: 'Lecture 1',
    subtitle: 'Artificial Intelligence (AI) Training Courses - Lecture 1',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumb: '/src/assets/images/course-1.png',
  },
  {
    id: '2',
    title: 'Lecture 2',
    subtitle: 'Artificial Intelligence (AI) Training Courses - Lecture 2',
    src: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    thumb: '/src/assets/images/course-2.png',
  },
  {
    id: '3',
    title: 'Lecture 3',
    subtitle: 'Artificial Intelligence (AI) Training Courses - Lecture 3',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumb: '/src/assets/images/course-3.png',
  },
];

const Watch = () => {
  const { id, lectureId } = useParams();
  const navigate = useNavigate();
  const [currentId, setCurrentId] = React.useState(
    lectureId || demoLectures[0].id
  );

  React.useEffect(() => {
    if (lectureId && lectureId !== currentId) setCurrentId(lectureId);
  }, [lectureId]);

  const index = demoLectures.findIndex((l) => l.id === currentId);
  const current = demoLectures[index] || demoLectures[0];

  const goTo = (idx) => {
    const safe = Math.max(0, Math.min(demoLectures.length - 1, idx));
    const next = demoLectures[safe];
    setCurrentId(next.id);
    navigate(`/courses/${id}/watch/${next.id}`);
  };

  const handleSelect = (nextId) => {
    const idx = demoLectures.findIndex((l) => l.id === nextId);
    goTo(idx);
  };

  const handlePrev = () => goTo(index - 1);
  const handleNext = () => goTo(index + 1);

  const canPrev = index > 0;
  const canNext = index < demoLectures.length - 1;

  return (
    <div className='min-h-screen bg-white text-black'>
      <Header />
      <main className='section-container py-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2'>
            <VideoPlayer
              src={current.src}
              poster={current.thumb}
              title={`Artificial Intelligence (AI) Training Courses - ${current.title}`}
              onPrev={canPrev ? handlePrev : undefined}
              onNext={canNext ? handleNext : undefined}
              canPrev={canPrev}
              canNext={canNext}
            />
          </div>
          <div className='lg:col-span-1'>
            <Playlist
              items={demoLectures}
              currentId={currentId}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Watch;
