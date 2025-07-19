interface props {
    quiz: {
        q_statement: string;
    }[];
}

export default function Hello({ quiz }: props) {
    return (
        <div>
            <h1>Hello</h1>
            <p>Welcome to the Quiz Tayari application. {quiz[0].q_statement}</p>
            <pre>{JSON.stringify(quiz[0], null, 2)}</pre>
        </div>
    );
}
