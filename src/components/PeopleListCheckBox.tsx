import React from 'react';

interface Person {
    role: string;
    id: number;
    icon: React.ReactElement;
    name: string;
}
interface PeopleListCheckBoxProps {
    people: Person[];
    role: string;
}

const PeopleListCheckBox: React.FC<PeopleListCheckBoxProps> = ({ people, role }) => {
    const filterPeople = people.filter((person) => person.role === role);
    return (
        <div className="">
            <hr className="mt-2 border-t-2 border-blue-500 my-4" />
            {filterPeople.map((person) => (
                <div className="mt-6">
                    <div key={person.id} className="grid gap-y-12  items-center ">
                        <div className="flex gap-x-10 items-center">
                            <div className="text-3xl">{person.icon}</div>
                            <div className="text-lg">{person.name}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PeopleListCheckBox;
