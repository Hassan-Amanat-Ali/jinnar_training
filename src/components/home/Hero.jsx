import { Button } from '../ui';
import { HomeHeroImg, SatisfiedClients } from '../../assets';
import { MdNavigateNext } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(ROUTES.COURSES);
  };

  const handleWatchDemo = () => {
    navigate(ROUTES.COURSES);
  };

  return (
    <section className='bg-white py-8 lg:py-8'>
      <div className='section-container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center  justify-center'>
          {/* Left Content */}
          <div className='order-2 lg:order-1 '>
            <h1 className='text-3xl md:text-3xl lg:text-5xl font-semibold mb-6 leading-tight text-black'>
              Transform Your Future
              <br />
              <span className='text-black'>with Experts</span>
              <br />
              <span className='text-secondary'>Lead Learning</span>
            </h1>

            <p className='text-lg md:text-xl text-black mb-8 leading-relaxed'>
              Join thousands of learners mastering new skills with our curated
              courses. All content is professionally crafted and reviewed by our
              expert team.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 mb-8'>
              <Button
                text='Start Learning'
                className='btn-base-large btn-primary'
                onClick={handleStartLearning}
                icon={<MdNavigateNext className='text-white w-6 h-6' />}
              />
              <Button
                text='Watch Demo'
                className='btn-base-large btn-gray'
                onClick={handleWatchDemo}
              />
            </div>

            {/* Satisfied Clients */}
            <div className='flex items-center gap-4'>
              <img
                src={SatisfiedClients}
                alt='Satisfied clients'
                className='h-20'
              />
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className='order-2 relative flex items-center justify-center'>
            <div className='relative'>
              <img
                src={HomeHeroImg}
                alt='Student learning'
                className='w-full max-w-[550px] h-auto rounded-2xl'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
