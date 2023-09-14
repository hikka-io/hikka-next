"use client";

import Slider from "@/app/components/Slider";
import { Option, Select } from "@mui/base";

const Component = () => {
  return (
    <div className="flex justify-center">
      <div>
        <div>
          <label className="label">
            <span className="label-text text-secondary">Жанр</span>
          </label>
          <Select
            defaultValue={1}
            className="font-w select-bordered select select-lg h-16 w-full max-w-xs items-center bg-dark-grey font-normal text-text-color"
          >
            <Option value={1}>Виберіть жанр</Option>
            <Option value={2}>Action</Option>
            <Option value={3}>Hentai</Option>
          </Select>
        </div>
        <div className="form-control mt-9">
          <label className="label cursor-pointer">
            <input type="checkbox" className="checkbox" />
            <span className="label-text ">Перекладено українською</span>
          </label>
        </div>
        <div className="mt-9">
          <label className="label">
            <span className="label-text text-secondary">Статус</span>
          </label>
          <div className="flex gap-2">
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              Онгоінг
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              Анонс
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
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
          <div className="flex gap-2">
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              Серіал
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              Фільм
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
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
          <div className="flex gap-2">
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              Зима
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              Весна
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
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
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              G
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              PG
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              PG-13
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              R
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              R+
            </button>
            <button className="btn-ghost btn-outline btn-sm btn rounded-3xl px-3.5 py-1">
              RX
            </button>
          </div>
          <div className="mt-9">
            <Slider
              min={1980}
              max={2023}
              label="Рік"
              defaultValue={[1999, 2023]}
              marks="years"
            />
          </div>
          <div className="mt-9">
            {/*<Slider
                            min={1}
                            max={10}
                            label="Оцінка"
                            defaultValue={[5, 10]}
                            marks={true}
                        />*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
