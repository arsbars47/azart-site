type SectionHeadingProps = {
  title: string;
  note?: string;
  id?: string;
};

export default function SectionHeading({ title, note, id }: SectionHeadingProps) {
  return (
    <header className="mb-10">
      {note && <p className="font-accent text-2xl text-navy-deep/75">{note}</p>}
      <h2 id={id} className="text-3xl font-black uppercase tracking-wide text-navy md:text-5xl">
        {title}
      </h2>
      <span aria-hidden className="mt-4 block h-1.5 w-16 bg-accent" />
    </header>
  );
}
