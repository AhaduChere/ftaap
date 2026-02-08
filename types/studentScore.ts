export type StudentScore = {
    inserted_date:Date,
    student_comprehension_score: number,
    student_dibel_MAZE:number,
    student_dibel_ORF:number,
    student_dibel_score:number,
    student_fluency_score:number,
    student_id:number,
    student_score_id:number,
    student_vocab_score:number,
    student_known_words: string[],
    student_unkown_words:string[]
}