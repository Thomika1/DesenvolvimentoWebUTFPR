"""
RAG Ultra-Leve sem embeddings complexos
Usa busca por similaridade de texto simples (TF-IDF)
"""
import os
import json
from typing import List, Optional
from pathlib import Path

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False


class RAGSimplificado:
    """RAG ultra-leve usando TF-IDF (sem deep learning)"""
    
    def __init__(self):
        self.chunks = []
        self.vectorizer = None
        self.tfidf_matrix = None
        
        if HAS_SKLEARN:
            print("📦 Usando TF-IDF para busca rápida")
            self.vectorizer = TfidfVectorizer(
                max_features=500,
                lowercase=True,
                min_df=1,
                max_df=0.95
            )
        else:
            print("⚠️ scikit-learn não instalado. Instale: pip install scikit-learn")
    
    def load_document(self, file_path: str, chunk_size: int = 1500):
        """Carrega documento"""
        if not os.path.exists(file_path):
            print(f"❌ Arquivo não encontrado: {file_path}")
            return False
        
        print(f"📄 Carregando: {file_path}")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Divide em chunks
        self.chunks = self._split_text(content, chunk_size)
        print(f"✅ {len(self.chunks)} chunks criados")
        return True
    
    def _split_text(self, text: str, chunk_size: int = 300, overlap: int = 200) -> List[str]:
        """Divide em chunks mantendo parágrafos inteiros quando possível"""
        # Primeiro divide por seções principais (linhas em branco duplas)
        sections = text.split('\n\n')
        
        chunks = []
        current_chunk = ""
        
        for section in sections:
            section = section.strip()
            if not section:
                continue
            
            # Se o chunk atual + seção cabe, adiciona
            if len(current_chunk) + len(section) + 4 <= chunk_size:
                current_chunk += section + "\n\n"
            else:
                # Se atual tem conteúdo, salva
                if len(current_chunk) > 100:
                    chunks.append(current_chunk.strip())
                # Se seção é muito grande, divide
                if len(section) > chunk_size:
                    # Divide seção grande por pontos ou linhas
                    sub_chunks = section.split('. ')
                    sub_chunk = ""
                    for sub in sub_chunks:
                        if len(sub_chunk) + len(sub) + 2 <= chunk_size:
                            sub_chunk += sub + ". "
                        else:
                            if len(sub_chunk) > 100:
                                chunks.append(sub_chunk.strip())
                            sub_chunk = sub + ". "
                    if len(sub_chunk) > 100:
                        chunks.append(sub_chunk.strip())
                    current_chunk = ""
                else:
                    current_chunk = section + "\n\n"
        
        # Salva o último chunk
        if len(current_chunk) > 100:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def build_index(self):
        """Constrói índice TF-IDF"""
        if not self.chunks or not self.vectorizer:
            print("❌ Sem chunks ou sklearn")
            return False
        
        print(f"\n🔨 Construindo índice TF-IDF...")
        try:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.chunks)
            print(f"✅ Índice criado! Matriz shape: {self.tfidf_matrix.shape}")
            return True
        except Exception as e:
            print(f"❌ Erro: {e}")
            return False
    
    def retrieve(self, query: str, k: int = 3) -> List[str]:
        """Busca chunks similares"""
        if not self.chunks or self.tfidf_matrix is None:
            return []
        
        try:
            # Transforma query em TF-IDF
            query_vec = self.vectorizer.transform([query])
            
            # Calcula similaridade
            similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
            
            # Top k (sem threshold mínimo para pegar os k melhores mesmo que baixa similaridade)
            top_indices = similarities.argsort()[-k:][::-1]
            results = [self.chunks[i] for i in top_indices]
            
            # Debug
            print(f"🔍 Query: '{query}'")
            for i, idx in enumerate(top_indices):
                print(f"  [{i+1}] Similaridade: {similarities[idx]:.3f}")
            
            return results
        except Exception as e:
            print(f"❌ Erro na busca: {e}")
            return []
    
    def save_index(self, index_path: str = "rag_index.json"):
        """Salva chunks"""
        if not self.chunks:
            return
        
        data = {"chunks": self.chunks}
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
        
        print(f"💾 Índice salvo: {index_path}")
    
    def load_index(self, index_path: str = "rag_index.json"):
        """Carrega chunks"""
        if not os.path.exists(index_path):
            return False
        
        with open(index_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.chunks = data.get("chunks", [])
        
        if self.chunks and self.vectorizer:
            print("🔄 Reconstruindo TF-IDF...")
            self.build_index()
        
        return True


# Instância global
rag_system: Optional[RAGSimplificado] = None


def initialize_rag():
    """Inicializa RAG"""
    global rag_system
    
    if HAS_SKLEARN:
        rag_system = RAGSimplificado()
        
        doc_path = os.path.join(os.path.dirname(__file__), "..", "utfpr_vestibular.txt")
        index_path = os.path.join(os.path.dirname(__file__), "..", "rag_index.json")
        
        if os.path.exists(index_path):
            print("📂 Carregando índice...")
            rag_system.load_index(index_path)
        elif os.path.exists(doc_path):
            print("📝 Criando índice...")
            rag_system.load_document(doc_path)
            rag_system.build_index()
            rag_system.save_index(index_path)


def get_context_for_query(query: str, k: int = 3) -> str:
    """Recupera contexto"""
    if not rag_system or not rag_system.chunks:
        return ""
    
    chunks = rag_system.retrieve(query, k)
    return "\n\n".join(chunks) if chunks else ""
