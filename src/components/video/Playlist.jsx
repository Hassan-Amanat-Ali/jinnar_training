import React from 'react';

const Playlist = ({ items = [], currentId, onSelect }) => {
  return (
    <aside className='bg-white text-black rounded-2xl p-4 w-full md:w-96 shadow-lg border border-gray-200 overflow-y-auto max-h-[80vh]'>
      <div className='space-y-4'>
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            className={`w-full text-left rounded-xl overflow-hidden bg-white border transition-colors shadow-sm hover:shadow-md ${
              currentId === it.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-gray-200'
            }`}
          >
            <img
              src={it.thumb}
              alt={it.title}
              className='w-full h-28 object-cover'
            />
            <div className='p-3'>
              <div className='text-sm font-semibold text-black'>{it.title}</div>
              <div className='text-xs text-black/60'>{it.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Playlist;
