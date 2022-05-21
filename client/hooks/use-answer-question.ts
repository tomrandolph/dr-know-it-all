export const useAnswerQuestion = () => {
  const answer = async (word) => {
    const res = await fetch('/api/answers', {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({word})})
    const {answer} = await res.json()
    return answer;
  }
  return answer;
}