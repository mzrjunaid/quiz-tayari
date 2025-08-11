export default function Edit({ mcq, rephrased }: { mcq: any; rephrased: any }) {
    return (
        <>
            <h1>Editing {mcq.q_statement}</h1>
            <p>{rephrased} test</p>
        </>
    );
}
