import os,json,time,redis,requests
r=redis.from_url(os.getenv('REDIS_URL','redis://localhost:6379'))
OR=os.getenv('OPENROUTER_API_KEY','')
def sentiment(text):
 try:
  q=requests.post('https://openrouter.ai/api/v1/chat/completions',headers={'Authorization':f'Bearer {OR}'},json={'model':'nousresearch/hermes-3-llama-3.1-405b','messages':[{'role':'user','content':f'Skor sentimen 0-100 + satu baris alasan: {text[:500]}'}]},timeout=15)
  return q.json()['choices'][0]['message']['content']
 except Exception as e: return f'ERR {e}'
if __name__=='__main__':
 print('scraper up')
 while True:
  r.publish('trend',json.dumps({'ts':time.time(),'note':'poll X/Telegram lalu sentiment() di sini'}))
  time.sleep(30)
