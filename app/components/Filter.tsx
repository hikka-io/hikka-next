"use client";

import * as Slider from "@radix-ui/react-slider";

const Component = () => {
  return (
    <>
      <div>
        <label className="label">
          <span className="label-text text-secondary">Жанр</span>
        </label>
        <select className="font-w select-bordered select select-lg h-16 w-full max-w-xs bg-dark-grey font-normal	">
          <option disabled selected>
            Виберіть жанр
          </option>
          <option>Action</option>
          <option>Hentai</option>
        </select>
      </div>
      <div className="form-control mt-9">
        <label className="label cursor-pointer">
          <input type="checkbox" checked="checked" className="checkbox" />
          <span className="label-text ">Перекладено українською</span>
        </label>
      </div>
      <div className="mt-9">
        <label className="label">
          <span className="label-text text-secondary">Статус</span>
        </label>
        <div className="flex">
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Онгоінг
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Анонс
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Реліз
          </button>
          <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
            Special
          </button>
        </div>
      </div>
      <div className="mt-9">
        <label className="label">
          <span className="label-text text-secondary">Тип</span>
        </label>
        <div className="flex">
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Серіал
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Фільм
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            OVA
          </button>
          <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
            ONA
          </button>
        </div>
      </div>
      <div className="mt-9">
        <label className="label">
          <span className="label-text text-secondary">Сезон</span>
        </label>
        <div className="flex">
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Зима
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Весна
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            Літо
          </button>
          <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
            Осінь
          </button>
        </div>
      </div>
      <div className="mt-9">
        <label className="label">
          <span className="label-text text-secondary">Рейтинг</span>
        </label>
        <div className="flex flex-wrap gap-y-2">
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            G
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            PG
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            PG-13
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            R
          </button>
          <button className="btn-ghost btn-outline btn-sm btn mr-2 rounded-3xl px-3.5 py-1">
            R+
          </button>
          <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
            RX
          </button>
        </div>
        <div className="mt-9">
          <label className="label">
            <span className="label-text text-secondary">Рік</span>
          </label>
          <form>
            <Slider.Root
              className="relative flex h-5 w-[200px] touch-none select-none items-center"
              defaultValue={[50]}
              max={100}
              step={1}
            >
              <Slider.Track className="bg-blackA10 relative h-[3px] grow rounded-full">
                <Slider.Range className="absolute h-full rounded-full bg-white" />
              </Slider.Track>
              <Slider.Thumb
                className="shadow-blackA7 hover:bg-violet3 focus:shadow-blackA8 block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_5px] focus:outline-none"
                aria-label="Volume"
              />
            </Slider.Root>
          </form>
        </div>
        <div className="mt-9">
          <label className="label">
            <span className="label-text text-secondary">Оцінка</span>
          </label>
          <form>
            <Slider.Root
              className="relative flex h-5 w-[200px] touch-none select-none items-center"
              defaultValue={[50]}
              max={100}
              step={1}
            >
              <Slider.Track className="bg-blackA10 relative h-[3px] grow rounded-full">
                <Slider.Range className="absolute h-full rounded-full bg-white" />
              </Slider.Track>
              <Slider.Thumb
                className="shadow-blackA7 hover:bg-violet3 focus:shadow-blackA8 block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_5px] focus:outline-none"
                aria-label="Volume"
              />
            </Slider.Root>
          </form>
        </div>
      </div>
    </>
  );
};

export default Component;
